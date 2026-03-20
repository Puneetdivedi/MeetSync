import whisper
import warnings

# Suppress FP16 warning on CPU
warnings.filterwarnings("ignore", message="FP16 is not supported on CPU; using FP32 instead")

def transcribe_audio(audio_path, model_size="base"):
    """
    Transcribes an audio file using OpenAI's Whisper model.
    Returns the transcription result dictionary containing 'text' and 'segments'.
    """
    print(f"Loading Whisper model '{model_size}'...")
    model = whisper.load_model(model_size)
    print(f"Transcribing {audio_path}...")
    result = model.transcribe(audio_path)
    return result
