export default function SendToPython(net) {
    $.ajax({
        type: 'POST',
        url: "/opa",
        data: { // parameters to send into python
            netlist: net
        },
        success: function (response) {
            console.log(response);
        }
    })
}