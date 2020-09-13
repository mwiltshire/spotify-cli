export const mockSearchAlbums = jest.fn(() => {
  return Promise.resolve({
    body: {
      albums: {
        items: [
          {
            uri: 'spotify:album:12lwDzvs23w1e8EKa5zQoC'
          }
        ]
      }
    }
  });
});
