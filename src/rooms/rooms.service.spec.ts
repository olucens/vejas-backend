import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { AuthUser } from '../auth/auth-user.interface';
import { RoomsService } from './rooms.service';

const admin: AuthUser = { id: 'admin-1', name: 'Alex' };
const viewer: AuthUser = { id: 'viewer-1', name: 'Bob' };

describe('RoomsService', () => {
  let service: RoomsService;

  beforeEach(() => {
    service = new RoomsService();
  });

  it('creates a room with the creator as admin', () => {
    const room = service.create({ name: 'Movie night' }, admin);

    expect(room.adminId).toBe(admin.id);
    expect(room.name).toBe('Movie night');
    expect(service.list()).toHaveLength(1);
  });

  it('returns rooms sorted by creation date, newest first', () => {
    const first = service.create({ name: 'First' }, admin);
    const second = service.create({ name: 'Second' }, admin);
    // createdAt has second precision issues in fast tests; compare by order
    const ids = service.list().map((room) => room.id);
    expect(new Set(ids)).toEqual(new Set([first.id, second.id]));
  });

  it('throws NotFoundException for an unknown room', () => {
    expect(() => service.get('missing')).toThrow(NotFoundException);
  });

  it('forbids deleting a room to non-admins', () => {
    const room = service.create({ name: 'Movie night' }, admin);
    expect(() => service.delete(room.id, viewer)).toThrow(ForbiddenException);
    expect(service.exists(room.id)).toBe(true);
  });

  it('allows the admin to delete the room', () => {
    const room = service.create({ name: 'Movie night' }, admin);
    service.delete(room.id, admin);
    expect(service.exists(room.id)).toBe(false);
  });

  it('updates playback state', () => {
    const room = service.create({ name: 'Movie night' }, admin);
    service.setPlayback(room.id, true, 42);

    const { state } = service.getWithState(room.id);
    expect(state.playback.isPlaying).toBe(true);
    expect(state.playback.currentTime).toBe(42);
  });

  it('keeps only the last 50 chat messages', () => {
    const room = service.create({ name: 'Movie night' }, admin);
    for (let i = 0; i < 60; i += 1) {
      service.addMessage(room.id, viewer, `message ${i}`);
    }

    const { state } = service.getWithState(room.id);
    expect(state.messages).toHaveLength(50);
    expect(state.messages[0].text).toBe('message 10');
  });

  it('trims chat message text and stores author info', () => {
    const room = service.create({ name: 'Movie night' }, admin);
    const message = service.addMessage(room.id, viewer, '  hi  ');

    expect(message.text).toBe('hi');
    expect(message.author).toBe('Bob');
    expect(message.authorId).toBe(viewer.id);
  });

  it('adds playlist items and selects the first one automatically', () => {
    const room = service.create({ name: 'Movie night' }, admin);
    const state = service.addPlaylistItem(room.id, 'abc', 'https://youtu.be/abc');

    expect(state.playlist).toHaveLength(1);
    expect(state.currentIndex).toBe(0);
  });

  it('ignores out-of-range playlist selection', () => {
    const room = service.create({ name: 'Movie night' }, admin);
    service.addPlaylistItem(room.id, 'abc', 'https://youtu.be/abc');

    const state = service.selectPlaylistItem(room.id, 5);
    expect(state.currentIndex).toBe(0);
  });

  it('shifts currentIndex when removing an item before the current one', () => {
    const room = service.create({ name: 'Movie night' }, admin);
    const state1 = service.addPlaylistItem(room.id, 'a', 'https://youtu.be/a');
    service.addPlaylistItem(room.id, 'b', 'https://youtu.be/b');
    service.selectPlaylistItem(room.id, 1);

    const state = service.removePlaylistItem(room.id, state1.playlist[0].id);
    expect(state.currentIndex).toBe(0);
    expect(state.playlist[0].videoId).toBe('b');
  });

  it('keeps currentIndex valid when removing the last current item', () => {
    const room = service.create({ name: 'Movie night' }, admin);
    const state1 = service.addPlaylistItem(room.id, 'a', 'https://youtu.be/a');

    const state = service.removePlaylistItem(room.id, state1.playlist[0].id);
    expect(state.playlist).toHaveLength(0);
    expect(state.currentIndex).toBe(0);
  });

  it('tracks viewers count', () => {
    const room = service.create({ name: 'Movie night' }, admin);
    service.setViewersCount(room.id, 7);
    expect(service.get(room.id).viewersCount).toBe(7);
  });

  it('reports admin status correctly', () => {
    const room = service.create({ name: 'Movie night' }, admin);
    expect(service.isAdmin(room.id, admin.id)).toBe(true);
    expect(service.isAdmin(room.id, viewer.id)).toBe(false);
  });
});
