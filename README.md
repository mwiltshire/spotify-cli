# Spotify CLI

## Commands

- [auth](#auth)
- [play](#play)
- [pause](#pause)
- [skip](#skip)
- [volume](#volume)
- [mute](#mute)
- [share](#share)

## `auth`

`$ spotify auth [port]`

Launch server to start app authentication.

**Arguments**

- `port` - _Optional_. Specify the port to start the server on. Defaults to `8080`.

## `play`

`$ spotify play`

Start or resume playback.

## `pause`

`$ spotify pause`

Pause playback.

## `skip`

`$ spotify skip [direction]`

Skip track.

**Arguments**

- `direction` - _Optional_. The direction to skip - must be either `forward` or `back`. Defaults to `forward`.

## `volume`

`$ spotify volume <percent>`

Set playback volume.

**Arguments**

- `percent` - **Required**. The volume percent to set. Must be a number between 0 and 100.

## `mute`

`$ spotify mute`

Mute playback. Alias for `spotify volume 0`.

## `share`

`$ spotify share`

Get a shareable link for the currently playing track. Copies link to clipboard.

## `shuffle`

`$ spotify shuffle <state>`

Toggle playback shuffle.

**Arguments**

- `state` - **Required**. The shuffle state to set. Must be either `on` or `off`.

## `repeat`

`$ spotify repeat <mode>`

Set playback repeat mode..

**Arguments**

- `mode` - **Required**. The repeat mode to set. Must be either `track`, `context` or `off`.
