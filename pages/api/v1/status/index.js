function status(request, response) {
  response.status(200).json({ chave: "funcionando perfeitamente" });
}

export default status;
