
import { useHookstate } from '@hookstate/core';
import { TimePeriod, storeState } from '@models/store';
import { Calendar } from 'primereact/calendar';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';


function getRange(period: Exclude<TimePeriod, TimePeriod.Custom>): [Date, Date] {
    let daysInPeriod = {
        [TimePeriod.Year]: 365,
        [TimePeriod.SixMonths]: 30 * 6,
        [TimePeriod.ThreeMonths]: 30 * 3,
        [TimePeriod.Month]: 30,
        [TimePeriod.Week]: 7,
    };
    return [
        new Date(Date.now() - (daysInPeriod[period]) * 24 * 60 * 60 * 1000),
        new Date()
    ];
}

export function TimeFilter() {
    let startDate = useHookstate(storeState.mapControls.startDate);
    let endDate = useHookstate(storeState.mapControls.endDate);
    let timePeriod = useHookstate(storeState.mapControls.timePeriod);

    let onRadioChange = (event: RadioButtonChangeEvent) => {
        if (event.value != TimePeriod.Custom) {
            let [start, end] = getRange(event.value as Exclude<TimePeriod, TimePeriod.Custom>);
            startDate.set(start);
            endDate.set(end);
        }
        timePeriod.set(event.value);
    }

    let generalFilters = <div>
        <div
            className="gap-3"
            style={{
                display: "grid",
                gridTemplateColumns: "auto max-content",
            }}
        >
            <div className="flex align-items-center gap-1">
                <RadioButton
                    inputId="year"
                    name="year"
                    value={TimePeriod.Year}
                    checked={timePeriod.get() === TimePeriod.Year}
                    onChange={onRadioChange} />
                <label htmlFor="year">Year</label>
            </div>
            <div className="flex align-items-center gap-1">
                <RadioButton
                    inputId="six_months"
                    name="six_months"
                    value={TimePeriod.SixMonths}
                    checked={timePeriod.get() === TimePeriod.SixMonths}
                    onChange={onRadioChange} />
                <label htmlFor="six_months" className="flex-shrink-0">6 months</label>
            </div>
            <div className="flex align-items-center gap-1">
                <RadioButton
                    inputId="month"
                    name="month"
                    value={TimePeriod.Month}
                    checked={timePeriod.get() === TimePeriod.Month}
                    onChange={onRadioChange} />
                <label htmlFor="month">Month</label>
            </div>
            <div className="flex align-items-center gap-1">
                <RadioButton
                    inputId="three_months"
                    name="three_months"
                    value={TimePeriod.ThreeMonths}
                    checked={timePeriod.get() === TimePeriod.ThreeMonths}
                    onChange={onRadioChange} />
                <label htmlFor="three_months">3 months</label>
            </div>
            <div className="flex align-items-center gap-1">
                <RadioButton
                    inputId="week"
                    name="week"
                    value={TimePeriod.Week}
                    checked={timePeriod.get() === TimePeriod.Week}
                    onChange={onRadioChange} />
                <label htmlFor="week">Week</label>
            </div>
            <div className="flex align-items-center gap-1">
                <RadioButton
                    inputId="custom"
                    name="custom"
                    value={TimePeriod.Custom}
                    checked={timePeriod.get() === TimePeriod.Custom}
                    onChange={onRadioChange} />
                <label htmlFor="custom">Custom</label>
            </div>
        </div>
    </div>;

    let customFilter = <div className="flex flex-column gap-1">
        <div className="flex flex-row align-items-center gap-2 justify-content-between">
            <span className="text-base"> Start </span>
            <Calendar
                style={{ height: "2.2rem" }}
                inputStyle={{ width: "7rem" }}
                value={startDate.get()}
                onChange={(e) => startDate.set(e.value ?? null)}
                showIcon
                showButtonBar
            />
        </div>
        <div className="flex flex-row align-items-center gap-2 justify-content-between">
            <span className="text-base"> End </span>
            <Calendar
                style={{ height: "2.2rem" }}
                inputStyle={{ width: "7rem" }}
                value={endDate.get()}
                onChange={(e) => endDate.set(e.value ?? null)}
                showIcon
                showButtonBar
            />
        </div>
    </div>;

    return <div className="flex flex-column gap-1 bg-white p-3 text-base shadow-5 border-round-lg border-2 border-primary">
        {generalFilters}
        {timePeriod.get() === TimePeriod.Custom ? customFilter : null}
    </div>;
}
