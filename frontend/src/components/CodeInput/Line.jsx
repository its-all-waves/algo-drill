import './Line.css'

export default function Line({ lineId, children}) {
	return <>
        <div className="line" data-line-id={lineId}>
            {children}
        </div>
    </>
}