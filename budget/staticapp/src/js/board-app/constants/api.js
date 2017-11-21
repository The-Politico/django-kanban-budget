export const BOARD = document.getElementsByName('board')[0].value;
export const TOKEN = document.getElementsByName('token')[0].value;
export const ROOT = document.getElementsByName('root')[0].value;

const headers = {
  headers: {
    Authorization: `Token ${TOKEN}`,
    'Content-Type': 'application/json',
  },
};

export const GET = Object.assign({}, headers, { method: 'GET' });
export const POST = Object.assign({}, headers, { method: 'POST' });
export const PATCH = Object.assign({}, headers, { method: 'PATCH' });
export const DELETE = Object.assign({}, headers, { method: 'DELETE' });
