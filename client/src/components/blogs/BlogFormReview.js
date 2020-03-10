// BlogFormReview shows users their form inputs for review
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import formFields from './formFields';
import { withRouter } from 'react-router-dom';
import * as actions from '../../actions';

class BlogFormReview extends Component {
    state = { file: null, isLoading: false };

    componentWillUnmount() {
        this.setState({ isLoading: false });
    }

    renderFields() {
        const { formValues } = this.props;

        return _.map(formFields, ({ name, label }) => {
            return (
                <div key={name}>
                    <label>{label}</label>
                    <div>{formValues[name]}</div>
                </div>
            );
        });
    }

    renderButtons() {
        const { onCancel } = this.props;

        return (
            <div>
                <button
                    className='yellow darken-4 white-text btn-flat'
                    onClick={onCancel}
                >
                    Back
                </button>
                <button className='teal btn-flat right white-text'>
                    Save Blog
                    <i className='material-icons right'>email</i>
                </button>
            </div>
        );
    }

    onSubmit(event) {
        event.preventDefault();
        this.setState({ isLoading: true });

        const { submitBlog, history, formValues } = this.props;

        submitBlog(formValues, this.state.file, history);
    }

    showLoading = () => {
        return (
            <div className='progress'>
                <div className='indeterminate'></div>
            </div>
        );
    };

    handleFileChange(event) {
        this.setState({ file: event.target.files[0] });
    }

    render() {
        console.log(this.state.isLoading);
        return (
            <form onSubmit={this.onSubmit.bind(this)}>
                <h5>Please confirm your entries</h5>
                {this.renderFields()}

                <br />

                <span>File </span>
                <input
                    type='file'
                    accept='image/*'
                    onChange={this.handleFileChange.bind(this)}
                />

                <br />
                <br />
                {!this.state.isLoading && this.renderButtons()}
                <br />
                {this.state.isLoading && this.showLoading()}
                <br />
            </form>
        );
    }
}

function mapStateToProps(state) {
    return { formValues: state.form.blogForm.values };
}

export default connect(mapStateToProps, actions)(withRouter(BlogFormReview));
