const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
}

const isLastMessage = (messages, index) => {
  if (index === messages.length - 1){
    return true;
  }

  if (messages[index].sender._id === messages[index + 1].sender._id) {
    return false;
  }

  return true;
}

export {
  getSender,
  isLastMessage
}