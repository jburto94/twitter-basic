import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';

import { createProfile, getCurrentProfile } from '../../actions/profileActions';
import isEmpty from '../../validation/is-empty';

class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bio: '',
      location: '',
      website: '',
      errors: {}
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentProfile();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if(nextProps.profile.profile) {
      const profile = nextProps.profile.profile;

      profile.bio = !isEmpty(profile.bio) ? profile.bio : '';
      profile.location = !isEmpty(profile.location) ? profile.location : '';
      profile.website = !isEmpty(profile.website) ? profile.website : '';

      this.setState({
        bio: profile.bio,
        location: profile.location,
        website: profile.website
      });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const profileData = {
      bio: this.state.bio,
      location: this.state.location,
      website: this.state.website
    };

    this.props.createProfile(profileData, this.props.history);
  }

  render() {
    const { errors } = this.state;

    return (
      <div className='edit-profile'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-8 m-auto'>
              <h1 className='display-4 text-center'>Edit Your Profile</h1>
              <form onSubmit={this.onSubmit}>
                <TextAreaFieldGroup
                  placeholder='Bio'
                  name='bio'
                  value={this.state.bio}
                  onChange={this.onChange}
                  error={errors.bio}
                  info='Tell us a little about yourself'
                />
                <TextFieldGroup
                  placeholder='Location'
                  name='location'
                  value={this.state.location}
                  onChange={this.onChange}
                  error={errors.location}
                  info='Your location'
                />
                <TextFieldGroup
                  placeholder='Website'
                  name='website'
                  value={this.state.website}
                  onChange={this.onChange}
                  error={errors.website}
                  info='Your website'
                />
                <input type='submit' value='Submit' className='btn btn-primary btn-block mt-4' />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

EditProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(withRouter(EditProfile));