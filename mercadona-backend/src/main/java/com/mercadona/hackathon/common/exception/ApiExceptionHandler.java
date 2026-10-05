package com.mercadona.hackathon.common.exception;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {
  @ExceptionHandler(ApiException.class)
  public ResponseEntity<ProblemDetail> handleApiException(ApiException exception) {
    ProblemDetail problem =
        ProblemDetail.forStatusAndDetail(exception.getStatus(), exception.getMessage());
    problem.setProperty("code", exception.getCode());
    return ResponseEntity.status(exception.getStatus()).body(problem);
  }

  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(
      MethodArgumentNotValidException exception,
      HttpHeaders headers,
      HttpStatusCode status,
      WebRequest request) {
    ProblemDetail problem =
        ProblemDetail.forStatusAndDetail(status, "Revisa los campos de la petición.");
    Map<String, String> errors = new LinkedHashMap<>();
    exception
        .getBindingResult()
        .getFieldErrors()
        .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
    problem.setProperty("code", "INVALID_CONFIGURATION");
    problem.setProperty("errors", errors);
    return handleExceptionInternal(exception, problem, headers, status, request);
  }
}
