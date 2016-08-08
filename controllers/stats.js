const Files = require('../models/file.js');

function show(req, res)
{
    let numberOfFilesQuery;
    let numberOfFilesTodayQuery;
    let today;
    let tomorrow;

    numberOfFilesQuery = Files.find({}).count();

    today = new Date();
    today.setHours(0, 0, 0, 0);
    tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);
    numberOfFilesTodayQuery = Files.find(
    {
        receivedAt:
        {
            $gt: today,
            $lt: tomorrow,
        },
    }).count();

    numberOfFilesQuery.exec(function(err, numberOfFiles)
    {
        if (err)
        {
            res.status(500).sendError();
            return;
        }

        numberOfFilesTodayQuery.exec(function(err2, numberOfFilesToday)
        {
            if (err2)
            {
                res.status(500).sendError();
                return;
            }

            if (req.isApi)
            {
                res.status(200).json({ numberOfFilesToday, numberOfFiles });
                return;
            }

            let response;

            response = '<html><body>';
            response += 'Number of files: ' + numberOfFiles;
            response += '<br>Number of files today: ' + numberOfFilesToday;
            response += '</body></html>';
            res.status(200).send(response);
        })
    });
}

module.exports = { show };
