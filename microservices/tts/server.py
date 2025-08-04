from flask import Flask, request, Response
from TTS.api import TTS
import io
import soundfile as sf

app = Flask(__name__)
tts = TTS(model_name="tts_models/en/ljspeech/vits", progress_bar=False)

@app.route("/tts", methods=["POST"])
def generate_audio():
    data = request.json
    text = data.get("text", "")
    if not text:
        return {"error": "No text provided"}, 400

    # Generate waveform (returns a NumPy array)
    wav = tts.tts(text)

    # Convert waveform to bytes using soundfile
    wav_io = io.BytesIO()
    sf.write(wav_io, wav, samplerate=22050, format='WAV')  # Coqui uses 22050Hz by default
    wav_io.seek(0)

    return Response(wav_io, mimetype="audio/wav")

if __name__ == "__main__":
    app.run(debug=True)
