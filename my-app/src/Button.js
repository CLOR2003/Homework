export default function Button(){
    function action(){
        alert("You clicked!")
    }
    return (<button onClick = {action}>Do not click</button>);
}