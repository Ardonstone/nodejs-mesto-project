enum HttpStatus {
  Ok = 200, // Успешный запрос
  Created = 201, // Ресурс создан
  BadRequest = 400, // Неверный запрос
  NotFound = 404, // Не найдено
  InternalServerError = 500, // Внутренняя ошибка сервера
}

export default HttpStatus;
