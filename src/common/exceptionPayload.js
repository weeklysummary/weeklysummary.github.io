export const getExceptionPayload = (ex) => {
    if (typeof ex === "object" && ex.hasOwnProperty("message") && ex.hasOwnProperty("code")) {
        return { errors: [ex.message], code: ex.code };
    }
    return { errors: ["Internal server error"], code: 500 };
}