import { Fragment, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import EventList from '../../components/events/event-list';
import ResultsTitle from '../../components/events/results-title';
import Button from '../../components/ui/button';
import ErrorAlert from '../../components/ui/error-alert';
// import { getFilteredEvents } from '../../helpers/api-util';

const FilteredEventsPage = () => {
    const router = useRouter();
    const [loadedEvents, setLoadedEvents] = useState();
    const filterData = router.query.slug;

    const { data, error } = useSWR(
        'https://next-playground-97289-default-rtdb.firebaseio.com/events.json'
    );

    useEffect(() => {
        if (data) {
            const transformedEvents = [];
            for (const key in data) {
                transformedEvents.push({
                    id: key,
                    ...data[key],
                });
            }
            setLoadedEvents(transformedEvents);
        }
    }, [data]);

    if (!loadedEvents) {
        return <p className="center">Loading ...</p>;
    }

    const filteredYear = +filterData[0];
    const filteredMonth = +filterData[1];

    const numYear = +filteredYear;
    const numMonth = +filteredMonth;

    if (
        isNaN(numYear) ||
        isNaN(numMonth) ||
        numYear > 2030 ||
        numYear < 2021 ||
        numMonth < 1 ||
        numMonth > 12 ||
        error
    ) {
        return (
            <Fragment>
                <ErrorAlert>
                    <p>Invalid filter !!!</p>
                </ErrorAlert>
                <div className="center">
                    <Button link="/events">Show all event</Button>
                </div>
            </Fragment>
        );
    }

    let filteredEvents = loadedEvents.filter((event) => {
        const eventDate = new Date(event.date);
        return (
            eventDate.getFullYear() === numYear &&
            eventDate.getMonth() === numMonth - 1
        );
    });

    if (!filteredEvents || filteredEvents.length === 0) {
        return (
            <Fragment>
                <ErrorAlert>
                    <p>No matched events !!!</p>
                </ErrorAlert>
                <div className="center">
                    <Button link="/events">Show all event</Button>
                </div>
            </Fragment>
        );
    }

    const dateObject = new Date(numYear, numMonth - 1);

    return (
        <Fragment>
            <ResultsTitle date={dateObject} />
            <EventList items={filteredEvents} />
        </Fragment>
    );
};

/* export async function getServerSideProps(context) {
    const { params } = context;
    const filterData = params.slug;

    const filteredYear = +filterData[0];
    const filteredMonth = +filterData[1];

    const numYear = +filteredYear;
    const numMonth = +filteredMonth;

    if (
        isNaN(numYear) ||
        isNaN(numMonth) ||
        numYear > 2030 ||
        numYear < 2021 ||
        numMonth < 1 ||
        numMonth > 12
    ) {
        return {
            hasError: true,
        };
    }

    const filteredEvents = await getFilteredEvents({
        year: numYear,
        month: numMonth,
    });

    return {
        props: {
            events: filteredEvents,
            date: {
                year: numYear,
                month: numMonth,
            },
        },
    };
} */

export default FilteredEventsPage;
