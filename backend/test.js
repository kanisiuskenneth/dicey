console.log(process.versions)
const callme = async () => {
	setTimeout(function() {
		return "HELLO";
	}, 3000);

}
function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}
const main = async () => {
	try {
	console.log("STARTING ASYNC")
	await sleep(1000);
	console.log("FINISHING ASYNC");
	}
	catch(e) {
	console.log("ERROR")
	console.log(e)
	}
}
main().then(() => {
	console.log("HELLO")}).catch( err => {
		console.log(err)})
