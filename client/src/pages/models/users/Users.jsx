import React, {useEffect, useState} from 'react';
import Table from "../../../components/table/Table";
import ENV from "../../../config/ENV";
import {useNavigate, useSearchParams} from "react-router-dom";
import PATHS from "../../../config/PATHS";
import THead from "../../../components/table/THead";
import THeadCell from "../../../components/table/THeadCell";
import TBody from "../../../components/table/TBody";
import TRow from "../../../components/table/TRow";
import TCell from "../../../components/table/TCell";

import moment from "moment";
import CreateModal from "./CreateModal";
import EditButton from "../../../components/buttons/EditButton";
import EditModal from "./EditModal";
import Token from "../../../helpers/Token";
import RemoveButton from "../../../components/buttons/RemoveButton";
import RemoveModal from "./RemoveModal";

function Users() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();
    const [pages, setPages] = useState(1)
    const [users, setUsers] = useState([])
    const [userUnderRemove, setUserUnderRemove] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [createModalMessage, setCreateModalMessage] = useState('')
    const [userUnderEdition, setUserUnderEdition] = useState(null)
    const [editModalMessage, setEditModalMessage] = useState('')

    const getAuthorization = () => {
        return {
            'Authorization': 'Bearer '.concat(
                Token.token
            )
        }
    }

    const timestampHumanizer = (timestamp) => {
        return moment.utc(timestamp).fromNow()
    }

    const order_by = (column) => {
        let order_by = searchParams.get('order_by') ?? 'id'
        let order = searchParams.get('order')
        if (column === order_by)
            order = order === 'asc' ? 'desc' : 'asc'
        else order = 'asc'
        searchParams.set('order_by', column)
        searchParams.set('order', order)
        setSearchParams(searchParams)
    }

    const onCreate = (data) => {
        setCreateModalMessage('')
        fetch(ENV.API_URL('/users', searchParams.toString()), {
            method: 'POST',
            headers: {
                ...getAuthorization(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(async (response) => {
                let response_data = await response.json();
                switch (response.status) {
                    case 200:
                    case 201:
                        setUsers(response_data);
                        setShowCreateModal(false);
                        break;
                    case 401:
                        navigate(PATHS.LOGIN);
                        break;
                    case 403:
                        setCreateModalMessage(response_data['detail'])
                        break;
                    default:
                        setCreateModalMessage('Server error, try again later.');
                        console.error(response_data);
                }
            })
    }

    const onEdit = (data) => {
        setEditModalMessage('')
        fetch(ENV.API_URL(`/users/${userUnderEdition['username']}`, searchParams.toString()), {
            method: 'PATCH',
            headers: {
                ...getAuthorization(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(async (response) => {
            let response_data = await response.json()
            switch (response.status) {
                case 200:
                    if (data['username'] !== userUnderEdition['username'])
                        Token.token = {
                            'token': response.headers.get('x-new-token'),
                            'expires_in': response.headers.get('x-new-token-expires-in')
                        }
                    setUsers(response_data);
                    setUserUnderEdition(null);
                    break;
                case 401:
                    navigate(PATHS.LOGIN);
                    break;
                case 403:
                    setEditModalMessage(response_data['detail'])
                    break;
                default:
                    setEditModalMessage('Server error, try again later.');
                    console.error(response_data);
            }
        })
    }

    const onRemove = () => {
        fetch(ENV.API_URL(`/users/${userUnderRemove['username']}`, searchParams.toString()), {
            method: 'DELETE',
            headers: {
                ...getAuthorization(),
                'Content-Type': 'application/json'
            }
        }).then(() => navigate(PATHS.LOGIN))
    }

    useEffect(() => {
        // Get user list
        fetch(ENV.API_URL('/users', searchParams.toString()), {
            headers: getAuthorization()
        }).then(async (response) => {
            let data = await response.json()
            setUsers(data)
        })
    }, [searchParams]);

    useEffect(() => {
        // Get number of pages
        fetch(ENV.API_URL('/users/count', searchParams.toString()),
            {
                headers: getAuthorization()
            }
        ).then(async (response) => {
            if (response.status === 401) navigate(PATHS.LOGIN)
            let data = await response.json()
            setPages(data['pages'])
        })
    }, [users]);

    useEffect(() => {
        if (!showCreateModal)
            setCreateModalMessage('')
    }, [showCreateModal]);

    useEffect(() => {
        if (userUnderEdition == null)
            setEditModalMessage('')
    }, [userUnderEdition]);

    return (
        <>
            <Table title="Users" description="All the users in the database"
                   pages={pages}
                   onClickAdd={() => setShowCreateModal(true)}>
                {!!users.length &&
                    <>
                        <THead>
                            <THeadCell onClick={() => order_by('id')}>
                                Id</THeadCell>
                            <THeadCell onClick={() => order_by('username')}>
                                Username</THeadCell>
                            <THeadCell onClick={() => order_by('email')}>
                                Email</THeadCell>
                            <THeadCell onClick={() => order_by('created_at')}>
                                Created At</THeadCell>
                            <THeadCell onClick={() => order_by('updated_at')}>
                                Updated At</THeadCell>
                            <THeadCell></THeadCell>
                        </THead>
                        <TBody>
                            {users.length && users.map((value) =>
                                <TRow key={value['id']}>
                                    <TCell>{value['id']}</TCell>
                                    <TCell>{value['username']}</TCell>
                                    <TCell>{value['email']}</TCell>
                                    <TCell>{timestampHumanizer(value['created_at'])}</TCell>
                                    <TCell>{timestampHumanizer(value['updated_at'])}</TCell>
                                    <TCell>
                                        <div className={"space-x-1 "
                                            .concat(
                                                value['username'] !== Token.username
                                                    ? 'hidden' : ''
                                            )}>
                                            <EditButton
                                                onClick={() =>
                                                    setUserUnderEdition(value)}/>
                                            <RemoveButton
                                                onClick={() =>
                                                    setUserUnderRemove(value)}/>
                                        </div>
                                    </TCell>
                                </TRow>
                            )}
                        </TBody>
                    </>
                }
            </Table>
            {showCreateModal &&
                <CreateModal onConfirm={onCreate}
                             onCancel={() => setShowCreateModal(false)}
                             message={createModalMessage}/>}
            {
                userUnderEdition != null &&
                <EditModal onConfirm={onEdit}
                           onCancel={() => setUserUnderEdition(null)}
                           user={userUnderEdition}
                           message={editModalMessage}/>
            }
            {
                userUnderRemove != null &&
                <RemoveModal onConfirm={onRemove}
                             onCancel={() => setUserUnderRemove(null)}
                             user={userUnderRemove}/>
            }
        </>
    );
}

export default Users;