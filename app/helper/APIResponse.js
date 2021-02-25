class APIResponse {

	/* Return response for success
	 * success status
	 * 200 - success
	 */
	success = (status, message, res, data = []) => {
		return res
			.status(200)
			.send({
				status: status,
				outputs: data,
				success: message
			})
	}

  /* Return response for error
	 * error status
	 * 404 - data not found
	 * 401 - invalid data
	 * 500 - internal server error
	 */
	error = (status, message, res, data = []) => {
		return res
			.status(status)
			.send({
				outputs: data,
				error: message
			})
	}

}

module.exports = APIResponse;