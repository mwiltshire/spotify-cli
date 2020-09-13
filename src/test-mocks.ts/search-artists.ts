export const mockSearchArtists = jest.fn(() => {
  return Promise.resolve({
    body: {
      artists: {
        items: [
          {
            uri: 'spotify:artist:34UhPkLbtFKRq3nmfFgejG'
          }
        ]
      }
    }
  });
});
