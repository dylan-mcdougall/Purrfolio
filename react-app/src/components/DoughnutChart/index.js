import React from "react";
import { Doughnut } from 'react-chartjs-2'
import {Chart as ChartJS} from 'chart.js/auto'



function DoughnutChart({chartData, total, cash}) {
    const textCenter = {
        id: 'textCenter',
        beforeDatasetsDraw(chart, arg, pluginOptions){
            const {ctx, data} = chart;

            ctx.save();
            ctx.font = 'bolder 25px sans-serif';
            ctx.fillStyle = 'red';
            ctx.textAlign = 'center';
            ctx.textBaseLine = 'middle'
            ctx.fillText(`Total Portfolio Value: ${total}`, chart.getDatasetMeta(0).data[0].x, chart.getDatasetMeta(0).data[0].y)
        }
    }
    return <Doughnut data={chartData} plugins={[textCenter]}/>
}

export default DoughnutChart
