namespace HelpDesk.Api.Services;

public enum ResultStatus { Ok, NotFound, Forbidden, BadRequest }

/// <summary>
/// A service outcome that a controller maps directly to an HTTP status code,
/// keeping authorization and not-found decisions in the service layer instead
/// of leaking them into controllers.
/// </summary>
public record ServiceResult<T>(ResultStatus Status, T? Value, string? Error)
{
    public bool IsOk => Status == ResultStatus.Ok;

    public static ServiceResult<T> Ok(T value) => new(ResultStatus.Ok, value, null);
    public static ServiceResult<T> NotFound() => new(ResultStatus.NotFound, default, null);
    public static ServiceResult<T> Forbidden(string? error = null) => new(ResultStatus.Forbidden, default, error);
    public static ServiceResult<T> BadRequest(string error) => new(ResultStatus.BadRequest, default, error);
}
