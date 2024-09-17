import './Line.css'

export default function Line({ children, id = -1}) {
	return <>
        <div id={'line-'+id} className="line">
            {children}
        </div>
    </>
}