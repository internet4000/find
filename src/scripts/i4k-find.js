import findApp from "../index.js"

/* Should handle user input when called from the shell */

/* get the user query from the arguments to a Find node.js call */
function queryFromArgs(args) {
	const userQuery = args.slice(2).join(" ");
	return userQuery
}

async function queryFromInputStream() {
	return new Promise((resolve, reject) => {
		process.stdin.resume();
		process.stdin.setEncoding('utf8');
		let userQueryStream = "";
		// user inputs data, or from shell stdin pipe `|` and `<` redirection
		process.stdin.on('data', (userQueryChunk) => {
			userQueryStream += userQueryChunk
		})
		// when the input is finished
		process.stdin.on('end', () => {
			resolve(userQueryStream.toString())
		})
		/* handle `C-d` user input, to stop, and handle, their stream;
			 `C-c` which would stop, and cancel the input strean (no Find);
		 no sure it is correctly done here */
		process.on('SIGINT', () => {
			resolve(userQueryStream.toString())
		});
	})
}

function i4kfind(readLineQuery) {
	const cleanQuery = readLineQuery.trim()
	let queryResult = ""
	if (cleanQuery) {
		queryResult = findApp.find(cleanQuery);
	}
	return queryResult
}

/* output for node, with a new line at the end */
function outputResult(queryResult) {
	process.stdout.write(queryResult + "\n");
}

async function main() {
	if (process.argv.length > 2) {
		const query = queryFromArgs(process.argv)
		const queryResult = i4kfind(query);
		outputResult(queryResult);
	} else {
		/* read user stream */
		const query = await queryFromInputStream()
		const userQueryLines = query.split('\n')
		userQueryLines.forEach(query => {
			const queryResult = i4kfind(query);
			outputResult(queryResult);
		})
		process.exit(0);
	}
}

// initialize the script on file open (in node.js)
main()
