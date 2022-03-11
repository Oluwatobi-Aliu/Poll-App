const form = document.getElementById('vote-form');
var event;

form.addEventListener('submit', e =>{
    
    const choice = document.querySelector('input[name=stack]:checked').value;
    const data = {stack: choice};

    fetch('http://localhost:3000/poll',{
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    }).then(res => res.json())
    .catch(err => console.log(err));

    e.preventDefault();
});

fetch("http://localhost:3000/poll")
    .then(res => res.json())
    .then(data => {
        let votes = data.votes;
        let totalVotes = votes.length;
        document.querySelector('#chartTitle').textContent = `Total Votes: ${totalVotes}`;

        let voteCounts = {
            Python: 0,
            JavaScript: 0,
            Java: 0,
            Other: 0
        };

        voteCounts = votes.reduce((acc, vote) => (
            (acc[vote.stack] = (acc[vote.stack] || 0) + parseInt(vote.points)), acc),
            {}
        );

        let dataPoints = [
            { label: 'Python', y: voteCounts.Python },
            { label: 'JavaScript', y: voteCounts.JavaScript },
            { label: 'Java', y: voteCounts.Java },
            { label: 'Other', y: voteCounts.Other }
        ];
            
        const chartContainer = document.querySelector('#chartContainer');
        
        if(chartContainer){

            // Listen for the event.
            document.addEventListener('votesAdded', function (e) { 
                document.querySelector('#chartTitle').textContent = `Total Votes: ${e.detail.totalVotes}`;
            });
            
            const chart = new CanvasJS.Chart('chartContainer', {
                animationEnabled: true,
                theme: 'theme1',
                data:[
                    {
                        type: 'column',
                        dataPoints: dataPoints
                    }
                ]
            });
            chart.render();
        
             // Enable pusher logging - don't include this in production
             Pusher.logToConsole = true;
        
             var pusher = new Pusher('b5d25e4b200a4cfe3b19', {
               cluster: 'mt1',
               encrypted: true
             });
         
             var channel = pusher.subscribe('os-poll');

             channel.bind('os-vote', function(data) {
               dataPoints.forEach((point)=>{
                   if(point.label==data.stack)
                   {
                        point.y+=data.points;
                        totalVotes+=data.points;
                        event = new CustomEvent('votesAdded',{detail:{totalVotes:totalVotes}});
                        // Dispatch the event.
                        document.dispatchEvent(event);
                   }
               });
               chart.render();
             });
        }

});
