import constant from "./constant";

// path -> /admin
// body -> {}
// {
//   name: "mgmg"
// }
// {
//   "name": "mgmg"
// }
async function post(path, body) {
  try {
    const resp = await fetch(constant.localDomain + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return resp;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// body = {
//   file: {........}
//   name: "mgmg"
// }
// body.file
// body["file"]
async function postFormData(path, body) {
  const formData = new FormData();
  for (let key in body) {
    formData.append(key, body[key]);
  }
  const resp = await fetch(constant.localDomain + path, {
    method: "POST",
    body: formData,
  });
  return resp;
}

async function postMedia(path, file, fileType) {
  let formData = new FormData();
  formData.append("file", file);
  formData.append("fileType", fileType);
  const resp = await fetch(constant.localDomain + path, {
    method: "POST",
    body: formData,
  });
  return resp;
}

async function putMedia(path, file, fileType, filePath) {
  let formData = new FormData();
  formData.append("file", file);
  formData.append("fileType", fileType);
  formData.append("filePath", filePath);
  const resp = await fetch(constant.localDomain + path, {
    method: "PUT",
    body: formData,
  });
  return resp;
}

// path -> /game
// path -> /game/10
// path -> /game?test=name
async function get(path, body) {
  try {
    const resp = await fetch(constant.localDomain + path, {
      method: "GET",
    });
    return resp;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function put(path, body) {
  const resp = await fetch(constant.localDomain + path, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return resp;
}

async function putFormData(path, body) {
  const formData = new FormData();
  for (let key in body) {
    formData.append(key, body[key]);
  }
  const resp = await fetch(constant.localDomain + path, {
    method: "PUT",
    body: formData,
  });
  return resp;
}

async function del(path, body) {
  const resp = await fetch(constant.localDomain + path, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return resp;
}

export default {
  post,
  postMedia,
  putMedia,
  get,
  put,
  del,
  postFormData,
  putFormData,
};
