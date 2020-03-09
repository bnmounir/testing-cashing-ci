import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchBlog } from '../../actions';

class BlogShow extends Component {
    componentDidMount() {
        this.props.fetchBlog(this.props.match.params._id);
    }
    renderImage() {
        console.log(this.props);
        if (this.props.blog.imageUrl) {
            return (
                <img
                    className='responsive-img'
                    src={
                        'https://blog-bucket-image-uploads.s3.amazonaws.com/' +
                        this.props.blog.imageUrl
                    }
                    alt={this.props.blog.title}
                />
            );
        }
    }

    render() {
        if (!this.props.blog) {
            return '';
        }

        const { title, content } = this.props.blog;

        return (
            <div>
                <br />
                <div className='row'>
                    <div className='col'>
                        <div className='card'>
                            <div className='card-image'>
                                {this.renderImage()}
                                <span className='card-title'>{title}</span>
                            </div>
                            <div className='card-content'>
                                <p>{content}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <br />
            </div>
        );
    }
}

function mapStateToProps({ blogs }, ownProps) {
    return { blog: blogs[ownProps.match.params._id] };
}

export default connect(mapStateToProps, { fetchBlog })(BlogShow);
