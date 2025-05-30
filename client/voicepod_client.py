import pyaudio
import wave
import requests
import time
import os
import pygame
RECORD_SECONDS= 5
FILENAME="input.wav"
BACKEND_URL = "http://localhost:5000/api/ai/ask"
RESPONSE_FILE = "response.mp3"

def record_voice():
    print("Recording...")
    audio = pyaudio.PyAudio()
    stream = audio.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=1024)
    frames = []
    for _ in range(0, int(16000 / 1024 * RECORD_SECONDS)):
        data = stream.read(1024)
        frames.append(data)
    stream.stop_stream()
    stream.close()
    audio.terminate()

    wf = wave.open(FILENAME, 'wb')
    wf.setnchannels(1)

    wf.setsampwidth(audio.get_sample_size(pyaudio.paInt16))
    wf.setframerate(16000)
    wf.writeframes(b''.join(frames))
    wf.close()

def send_to_backend():
    print("Sending audio to backend...")
    with open(FILENAME, 'rb') as f:
        files = {'audio': f}
        try:
            response = requests.post(BACKEND_URL, files=files)
        except requests.exceptions.RequestException as e:
            print(f"Error sending request: {e}")
            return None
        if response.status_code == 200:
            data = response.json()
            print("Ai says:", data['text'])
            return data['audioUrl']
        else:
            print(f"Error: {response.status_code} - {response.text}")
            return None
def play_audio(audio_url):
    print("Playing audio...")
    r = requests.get(audio_url)
    with open(RESPONSE_FILE, 'wb') as f:
        f.write(r.content)
    try:
        pygame.mixer.init()
        pygame.mixer.music.load(RESPONSE_FILE)
        pygame.mixer.music.play()
        while pygame.mixer.music.get_busy():
            pygame.time.Clock().tick(10)
    except pygame.error as e:
        print(f"Error playing audio: {e}")

print("Voicepod AI Assistant")
print("-------------------------")
while True:
    input("Press Enter to speak...")
    record_voice()
    url= send_to_backend()
    if url:
        play_audio(url)
    else:
        print("Failed to get a response from the backend.")