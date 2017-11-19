import * as types from '../constants/actions';

export const setNote = note => ({
  type: types.SET_NOTE,
  note,
});

export const openNote = () => ({
  type: types.OPEN_NOTE,
});

export const closeNote = () => ({
  type: types.CLOSE_NOTE,
});

export const sendNotes = (slug, notes) => ({
  type: types.SEND_NOTES,
  slug,
  notes,
});

export const sendNotesSuccess = () => ({
  type: types.SEND_NOTES_SUCCESS,
});
