let nextTodoId = 0
export const addTodo = text => ({
  type: 'ADD_TODO',
  id: nextTodoId++,
  text
});

export const setAccount = (id, phoneNumber) => ({
  type: 'ACCOUNT_AUTHED',
  id: id,
  phoneNumber: phoneNumber
});