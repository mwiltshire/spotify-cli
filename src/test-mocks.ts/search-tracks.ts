export const mockSearchTracks = jest.fn(() => {
  return Promise.resolve({
    body: {
      tracks: {
        items: [
          {
            uri: 'spotify:track:3xogCrlDsnIZ7nQo8VvRL6',
            name: 'Test',
            artists: [{ name: 'Test' }]
          }
        ]
      }
    }
  });
});
