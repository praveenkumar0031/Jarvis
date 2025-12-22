// client/src/services/audioService.js
export const recordAudio = () => {
  return new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.addEventListener('dataavailable', event => {
      audioChunks.push(event.data);
    });

    const start = () => {
      mediaRecorder.start();
    };

    const stop = () => {
      return new Promise(resolve => {
        mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(audioChunks);
          const reader = new FileReader();
          
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            const base64Audio = reader.result.split(',')[1];
            resolve(base64Audio);
          };
          
          stream.getTracks().forEach(track => track.stop());
        });

        mediaRecorder.stop();
      });
    };

    resolve({ start, stop });
  });
};

export const stopRecording = (recorder) => {
  if (recorder) {
    recorder.stop();
  }
};
