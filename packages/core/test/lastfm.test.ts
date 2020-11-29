import test from 'ava';
import mock from 'mock-require';

import MockStore from '../../../__mocks__/electron-store';
import MockLogger from '../../../__mocks__/electron-timber';
import * as electron from '../../../__mocks__/electron';

mock('electron-store', MockStore);
mock('electron-timber', MockLogger);
mock('electron', electron);

import { rest } from '../src';

const setupLastFmApi = (key: string, secret: string): rest.LastFmApi => {
  return new rest.LastFmApi(key, secret);
};

test('add api key to url', t => {
  const api = setupLastFmApi('test', 'test');
  const url = 'http://example.com?test=test1&test2=test3';
  const withKey = api.addApiKey(url);

  t.is(withKey, 'http://example.com?test=test1&test2=test3&api_key=test');
});

test('sign url', t => {
  const api = setupLastFmApi('test', 'test');
  const url = 'http://example.com?test=test1&test2=test3';
  const signed = api.sign(url);

  t.is(signed, '4dd7efc68ff9d7c293ac0f71eb133ace');
});

test('prepare url', t => {
  const api = setupLastFmApi('test', 'test');
  const url = 'http://example.com?test=test1&test2=test3';
  const prepared = api.prepareUrl(url);

  t.is(prepared, 'http://example.com?test=test1&test2=test3&api_key=test&api_sig=cd28b8fd248073c89aad9b77dd069567');
});

test('get top tracks', async t => {
  const api = setupLastFmApi('2b75dcb291e2b0c9a2c994aca522ac14',
    '2ee49e35f08b837d43b2824198171fc8');

  const response = await api.getTopTracks();
  const data = await response.json();

  t.is(typeof data.tracks, 'object');
  t.true(data.tracks.track instanceof Array);
});

test('get artist info', async t => {
  const api = setupLastFmApi('2b75dcb291e2b0c9a2c994aca522ac14',
    '2ee49e35f08b837d43b2824198171fc8');

  const response = await api.getArtistInfo('Linkin Park');
  const data = await response.json();

  t.is(typeof data.artist, 'object');
  t.true(data.artist.bio instanceof Object);
});

test('get artist top tracks', async t => {
  const api = setupLastFmApi('2b75dcb291e2b0c9a2c994aca522ac14',
    '2ee49e35f08b837d43b2824198171fc8');

  const response = await api.getArtistTopTracks('Linkin Park');
  const data = await response.json();

  t.is(typeof data.toptracks, 'object');
  t.true(data.toptracks.track instanceof Array);
});

test('search tracks', async t => {
  const api = setupLastFmApi('2b75dcb291e2b0c9a2c994aca522ac14',
    '2ee49e35f08b837d43b2824198171fc8');

  const response = await api.searchTracks('billie jean');
  const data = await response.json();

  t.is(typeof data.results, 'object');
  t.true(data.results.trackmatches.track instanceof Array);
  t.true(data.results.trackmatches.track.length > 0);
});

test('get top tags', async t => {
  const api = setupLastFmApi('2b75dcb291e2b0c9a2c994aca522ac14',
    '2ee49e35f08b837d43b2824198171fc8');

  const response = await api.getTopTags();
  const data = await response.json();

  t.is(typeof data.toptags, 'object');
  t.true(data.toptags.tag instanceof Array);
});

test('get tag info', async t => {
  const api = setupLastFmApi('2b75dcb291e2b0c9a2c994aca522ac14',
    '2ee49e35f08b837d43b2824198171fc8');

  const response = await api.getTagInfo('rock');
  const data = await response.json();

  t.is(typeof data.tag, 'object');
  t.true(data.tag.wiki instanceof Object);
});

test('get tag track', async t => {
  const api = setupLastFmApi('2b75dcb291e2b0c9a2c994aca522ac14',
    '2ee49e35f08b837d43b2824198171fc8');

  const response = await api.getTagTracks('rock');
  const data = await response.json();

  t.is(typeof data.tracks, 'object');
  t.true(data.tracks.track instanceof Array);
});

test('get tag album', async t => {
  const api = setupLastFmApi('2b75dcb291e2b0c9a2c994aca522ac14',
    '2ee49e35f08b837d43b2824198171fc8');

  const response = await api.getTagAlbums('rock');
  const data = await response.json();

  t.is(typeof data.albums, 'object');
  t.true(data.albums.album instanceof Array);
});

test('get tag artist', async t => {
  const api = setupLastFmApi('2b75dcb291e2b0c9a2c994aca522ac14',
    '2ee49e35f08b837d43b2824198171fc8');

  const response = await api.getTagArtists('rock');
  const data = await response.json();

  t.is(typeof data.topartists, 'object');
  t.true(data.topartists.artist instanceof Array);
});

test('get similar tag', async t => {
  const api = setupLastFmApi('2b75dcb291e2b0c9a2c994aca522ac14',
    '2ee49e35f08b837d43b2824198171fc8');

  const response = await api.getSimilarTags('rock');
  const data = await response.json();

  t.is(typeof data.similartags, 'object');
  t.true(data.similartags.tag instanceof Array);
});

test('get similar track', async t => {
  const api = setupLastFmApi('2b75dcb291e2b0c9a2c994aca522ac14',
    '2ee49e35f08b837d43b2824198171fc8');

  const response = await api.getSimilarTracks('Linkin Park', 'Numb');
  const data = await response.json();

  t.is(typeof data.similartracks, 'object');
  t.true(data.similartracks.track instanceof Array);
});
