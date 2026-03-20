from pyannote.audio import Pipeline
from config import HF_TOKEN

def diarize_audio(audio_path):
    \"\"\"
    Performs speaker diarization on an audio file using pyannote.audio.
    Requires a valid Hugging Face token in the environment.
    \"\"\"
    if not HF_TOKEN:
        raise ValueError("HF_TOKEN is not set. Diarization requires a Hugging Face token.")
        
    print("Loading pyannote.audio pipeline...")
    pipeline = Pipeline.from_pretrained(
        "pyannote/speaker-diarization-3.1",
        use_auth_token=HF_TOKEN
    )
    
    # Optional: Send to GPU if available
    import torch
    if torch.cuda.is_available():
        pipeline.to(torch.device("cuda"))

    print(f"Diarizing {audio_path}...")
    diarization = pipeline(audio_path)
    return diarization

def format_timestamp(seconds):
    \"\"\"Format seconds to HH:MM:SS or MM:SS\"\"\"
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    if hours > 0:
        return f"{hours:02d}:{minutes:02d}:{secs:02d}"
    return f"{minutes:02d}:{secs:02d}"

def merge_transcription_and_diarization(whisper_segments, diarization_result):
    \"\"\"
    Combines Whisper's timestamped text segments with pyannote's speaker labels.
    \"\"\"
    final_transcript = []
    
    # Convert diarization annotation to a list of (start, end, speaker)
    diarization_list = []
    for turn, _, speaker in diarization_result.itertracks(yield_label=True):
        diarization_list.append((turn.start, turn.end, speaker))
    
    for segment in whisper_segments:
        start_time = segment['start']
        end_time = segment['end']
        text = segment['text'].strip()
        
        # Find the speaker that overlaps the most with this segment
        best_speaker = "Unknown"
        max_overlap = 0
        
        for d_start, d_end, speaker in diarization_list:
            overlap_start = max(start_time, d_start)
            overlap_end = min(end_time, d_end)
            overlap = max(0, overlap_end - overlap_start)
            
            if overlap > max_overlap:
                max_overlap = overlap
                best_speaker = speaker
        
        timestamp = format_timestamp(start_time)
        final_transcript.append(f"[{timestamp}] {best_speaker}: {text}")
        
    return "\n".join(final_transcript)
