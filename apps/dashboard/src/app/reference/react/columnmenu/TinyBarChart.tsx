import { createRef, DetailedHTMLProps, HTMLAttributes, useEffect, useState } from "react";

export interface TinyBarChartProps extends DetailedHTMLProps<HTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement> {
    data: number[];
    min: number;
    max: number;
    width?: number;
    height?: number;
}

export const TinyBarChart = ({
    data,
    min,
    max,
    ...rest
}: TinyBarChartProps) => {

    const columnWidth = 1;
    const columnHeight = 40;
    const columnSpacing = 0;
    const canvasRef = createRef<HTMLCanvasElement>();
    const [canvas, setCanvas] = useState<HTMLCanvasElement>();
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
    const [highlightedColumn, setHighlightedColumn] = useState<number>(-1);
    const [val, setVal] = useState<string>("");
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            setCanvas(canvas);
            const ctx = canvas.getContext("2d");
            if (ctx)
                setCtx(ctx);
        }
    }, [canvasRef]);
    useEffect(() => {
        if (ctx) {
            if(!canvas)return;
            let x = 0;
            const height = canvas?.height;
            const y = (height || 50);
            ctx.clearRect(0, 0, canvas?.width, height);
            ctx.moveTo(0, 0);
            for (var i = 0; i < data.length; i++) {
                const barHeight = (data[i] / max) * columnHeight;
                if (i === highlightedColumn) {
                    ctx.fillStyle = "#ff9900";
                } else {
                    ctx.fillStyle = "#0099ff";
                }
                ctx.fillRect(x, y, columnWidth, 0-barHeight*2);
                x += columnWidth + columnSpacing;
            }
        }
    }, [ctx, data, min, max, highlightedColumn, canvas?.height, canvas]);
    const handleMouseMove = (e: any) => {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const column = Math.floor(mouseX / (columnWidth ));
        if (column >= 0 && column < data.length) {
            setHighlightedColumn(column);
            if(data[column])
            setVal(column+":"+data[column].toString());
        } else {
            setHighlightedColumn(-1);
            setVal("");
        }
    };
    return <>
    <div style={{position:"absolute", top:"0px", left:"0px"}}>{val}</div>
    <canvas ref={canvasRef} {...rest} onMouseMove={handleMouseMove} />
    </>;
};
