

fetch("https://test-project-361021.wl.r.appspot.com/getcountries", {
method: 'POST'
}).then(res=>{
    res.json().then(data=>{
        let select = document.getElementById("countries");
        let i=0;
        for(i=0;i<data.length;i++)
        {
            let option = document.createElement("option");
            option.value=data[i].CountryCode;
            option.text=data[i].Country;
            if (i==0)
            {
                option.selected=true;
            }
            select.add(option);
        }

    });
});


function executeQuery()
{
    console.log(document.getElementById('countries').value);
    fetch("https://test-project-361021.wl.r.appspot.com/getmeandata/", {
        headers:{
            'Access-Control-Allow-Origin':'*',
            'Content-Type': 'application/json'
            },
method: 'POST',
body: JSON.stringify({
    "intime": document.getElementById('startdate').value.toString(),
    "outTime": document.getElementById('enddate').value.toString(),
    "code": document.getElementById('countries').value, 
})
}).then(res=>{
    res.json().then(data=>{
        console.log(data);
    });
})
}