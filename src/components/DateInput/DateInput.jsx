const DateInput = ({name, date, setDate}) => {

    const handleChange = event => {
        const inputDate = event.target.value
        const formattedDate = formatDate(inputDate)
        setDate(formattedDate)
    };

    const formatDate = dateString => {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = zeroPad(date.getMonth() + 1)
        const day = zeroPad(date.getDate())
        const hours = zeroPad(date.getHours())
        const minutes = zeroPad(date.getMinutes())
        const seconds = zeroPad(date.getSeconds())
        const milliseconds = zeroPad(date.getMilliseconds(), 3)
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`
    };

    const zeroPad = (number, width = 2) => {
        return String(number).padStart(width, '0')
    };

    return (
        <div>
            <h3>{name + ' '}</h3>
            <input type="datetime-local" value={date} onChange={handleChange} />
        </div>
    )
}

export default DateInput;