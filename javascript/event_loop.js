function greet() {
    let name = "vishal"
    newName = "Zayed"
    function hello() {
        console.log(`Hi ${name}`)
    }
    name = "raju"
    return hello;
}
const say = greet()
console.log(newName)
say()

// output
// Zayed
// Hi raju