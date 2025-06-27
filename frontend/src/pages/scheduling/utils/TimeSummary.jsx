export default function TimeSummary({ descriptionText, errorText, hasError, className }) {
    return (
        <div className={className}>
            {hasError ? errorText : descriptionText}
        </div>
    );
}