import { Command } from 'commander';
import { play, playArtist, playTrack, playAlbum } from '../actions';

const playCommand = new Command('play')
  .description('Start or resume playback.')
  .action(play);

playCommand.command('artist <name>').action(playArtist);
playCommand.command('track <name>').action(playTrack);
playCommand.command('album <name>').action(playAlbum);

export default playCommand;
