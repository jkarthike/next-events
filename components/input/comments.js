import { useState, useEffect, useContext } from 'react';
import NotificationContext from '../../store/notification-context';

import CommentList from './comment-list';
import NewComment from './new-comment';
import classes from './comments.module.css';

function Comments(props) {
    const { eventId } = props;
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [isFetchingComments, setIsFetchingComments] = useState(false);
    const notificationCtx = useContext(NotificationContext);

    useEffect(() => {
        if (showComments) {
            setIsFetchingComments(true);
            fetch(`/api/comments/${eventId}`)
                .then((response) => response.json())
                .then((data) => {
                    setComments(data.comments);
                    setIsFetchingComments(false);
                });
        }
    }, [showComments]);

    function toggleCommentsHandler() {
        setShowComments((prevStatus) => !prevStatus);
    }

    function addCommentHandler(commentData) {
        notificationCtx.showNotification({
            title: 'Sending Comments ...',
            message: 'Your comments are being sent',
            status: 'pending',
        });

        fetch(`/api/comments/${eventId}`, {
            method: 'POST',
            body: JSON.stringify(commentData),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return response.json().then((data) => {
                    throw new Error(data.message || 'Something went wrong !!!');
                });
            })
            .then((data) => {
                notificationCtx.showNotification({
                    title: 'Success',
                    message: 'Comment sent !!!',
                    status: 'success',
                });
            })
            .catch((error) => {
                notificationCtx.showNotification({
                    title: 'Error',
                    message: error.message || 'Something went wrong',
                    status: 'error',
                });
            });
    }

    return (
        <section className={classes.comments}>
            <button
                className={classes.commentsButton}
                onClick={toggleCommentsHandler}
            >
                {showComments ? 'Hide' : 'Show'} Comments
            </button>
            {showComments && <NewComment onAddComment={addCommentHandler} />}
            {showComments && !isFetchingComments && (
                <CommentList items={comments} />
            )}
            {showComments && isFetchingComments && <p>Loading ...</p>}
        </section>
    );
}

export default Comments;
