using HelpDesk.Api.Auth;
using HelpDesk.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace HelpDesk.Api.Controllers;

[ApiController]
public abstract class ApiControllerBase : ControllerBase
{
    /// <summary>The authenticated caller, projected from the JWT.</summary>
    protected CurrentUser Caller => User.ToCurrentUser();

    /// <summary>Maps a non-OK service result to an RFC 7807 ProblemDetails response.</summary>
    protected ActionResult Problemify<T>(ServiceResult<T> result) => result.Status switch
    {
        ResultStatus.NotFound => Problem(statusCode: StatusCodes.Status404NotFound, title: "Not found", detail: result.Error),
        ResultStatus.Forbidden => Problem(statusCode: StatusCodes.Status403Forbidden, title: "Forbidden", detail: result.Error),
        ResultStatus.BadRequest => Problem(statusCode: StatusCodes.Status400BadRequest, title: "Invalid request", detail: result.Error),
        _ => Problem(statusCode: StatusCodes.Status500InternalServerError)
    };
}
