from openai import OpenAI
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import Response
from twilio.twiml.voice_response import VoiceResponse
from twilio.rest import Client

import json
import base64
import audioop
import numpy as np
import whisper
from scipy.signal import resample
import time
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# ==============================
# Secure Credentials (ENV ONLY)
# ==============================
ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


twilio_client = Client(ACCOUNT_SID, AUTH_TOKEN)

openrouter_client = OpenAI(
    api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1"
)

# ==============================
# Load Whisper
# ==============================
print("🧠 Loading Whisper model...")
model = whisper.load_model("small")
print("✅ Whisper model loaded")


# ==============================
# Voice Webhook
# ==============================
@app.post("/voice")
async def voice_webhook():
    response = VoiceResponse()

    response.start().stream(
        url="wss://4453-2409-40f4-3150-f285-a183-564d-ef15-165c.ngrok-free.app/media"
    )

    response.say("You are now connected to NH2 AI support.")
    response.pause(length=60)

    return Response(content=str(response), media_type="application/xml")


# ==============================
# Intelligence Layer
# ==============================
def analyze_and_generate(user_text):

    system_prompt = """
You are an AI customer support consultant.

Return STRICT JSON ONLY.

Format:
{
  "intent": "billing | technical | complaint | general_query | feedback",
  "sentiment": "calm | neutral | frustrated | angry",
  "escalate": true or false,
  "reply": "short professional response (max 2 sentences)"
}

Rules:
- Escalate if user is clearly angry.
- Reply must be concise and reassuring.
- No text outside JSON.
"""

    try:
        response = openrouter_client.chat.completions.create(
            model="mistralai/mixtral-8x7b-instruct",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_text}
            ],
            temperature=0.2
        )

        content = response.choices[0].message.content.strip()

        # Extract JSON safely
        start = content.find("{")
        end = content.rfind("}") + 1
        json_string = content[start:end]

        return json.loads(json_string)

    except Exception as e:
        print("⚠️ LLM Error:", str(e))
        return {
            "intent": "general_query",
            "sentiment": "neutral",
            "escalate": False,
            "reply": "Thank you for contacting us. Could you please clarify your concern?"
        }


# ==============================
# Media Stream
# ==============================
@app.websocket("/media")
async def media_stream(websocket: WebSocket):
    await websocket.accept()
    print("🎙 Media stream connected")
    last_user_message = ""
    audio_buffer = b""
    ignore_initial_audio = True
    initial_audio_bytes = 0

    last_transcript_time = time.time()
    last_audio_time = time.time()
    silence_threshold = 1.2

    conversation_text = ""
    last_response_time = 0
    response_cooldown = 4.0

    call_sid = None
    call_active = True

    try:
        while call_active:
            message = await websocket.receive_text()
            data = json.loads(message)

            event_type = data.get("event")

            if event_type == "start":
                call_sid = data["start"]["callSid"]
                print("📞 Call started:", call_sid)

            elif event_type == "media":

                payload = data["media"]["payload"]
                ulaw_audio = base64.b64decode(payload)
                pcm_audio = audioop.ulaw2lin(ulaw_audio, 2)

                if ignore_initial_audio:
                    initial_audio_bytes += len(pcm_audio)
                    if initial_audio_bytes > 16000:
                        ignore_initial_audio = False
                        print("🎤 Listening to user...")
                    continue

                audio_buffer += pcm_audio
                last_audio_time = time.time()

                if len(audio_buffer) > 128000:

                    audio_np = np.frombuffer(audio_buffer, np.int16)
                    audio_resampled = resample(audio_np, len(audio_np) * 2)
                    audio_float = audio_resampled.astype(np.float32) / 32768.0

                    result = model.transcribe(
                        audio_float,
                        fp16=False,
                        language="en",
                        temperature=0
                    )

                    transcript = result["text"].strip()

                    if transcript:
                        cleaned_transcript = transcript.strip().lower()

                        if cleaned_transcript and cleaned_transcript != last_user_message:
                            print("📝 Transcript:", cleaned_transcript)

                            conversation_text = cleaned_transcript
                            last_user_message = cleaned_transcript
                            last_transcript_time = time.time()

                    audio_buffer = audio_buffer[-32000:]

            elif event_type == "stop":
                print("📴 Call stopped")
                call_active = False
                break

            # ======================
            # Silence Detection
            # ======================
            if call_active and not ignore_initial_audio:

                current_time = time.time()

                if (
                    current_time - last_transcript_time > silence_threshold
                    and conversation_text.strip()
                    and current_time - last_response_time > response_cooldown
                ):

                    print("🤖 Running intelligence engine...")

                    analysis = analyze_and_generate(conversation_text.strip())

                    print("📊 Intent:", analysis["intent"])
                    print("😊 Sentiment:", analysis["sentiment"])
                    print("🚨 Escalate:", analysis["escalate"])

                    reply_text = analysis["reply"]
                    print("🗣 Reply:", reply_text)

                    if call_sid:
                        try:
                            twiml = f"""
                            <Response>
                                <Say>{reply_text}</Say>
                                <Pause length="30"/>
                            </Response>
                            """
                            twilio_client.calls(call_sid).update(twiml=twiml)
                        except Exception as e:
                            print("⚠️ Twilio update skipped:", str(e))

                    conversation_text = ""
                    last_response_time = current_time

    except WebSocketDisconnect:
        print("🔌 WebSocket disconnected")