import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';

import 'react-dates/lib/css/_datepicker.css';

const bestID = (d) => {
  if (d.last_name && d.first_name) return `${d.first_name} ${d.last_name}`;
  if (d.last_name) return d.last_name;
  if (d.email) return d.email;
  if (d.username) return d.username;
  return 'Anonymous';
};


class Filter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedInput: null,
    };
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleClickOutside() {
    this.props.closePanel();
  }

  render() {
    const filters = this.props.filters;
    const db = this.props.session;
    const developerModels = db.User.filter(b => b.developer).toRefArray();
    const typeModels = db.Type.all().toRefArray();

    const developers = developerModels.map((dev) => {
      const i = filters.developers.indexOf(dev.id);
      return (
        <div
          className="filter-option"
          onClick={i < 0 ?
            () => this.props.actions.addFilterDeveloper(dev.id) :
            () => this.props.actions.removeFilterDeveloper(dev.id)
          }
        >
          <i
            className={i < 0 ? 'fa fa-square-o fa-fw' : 'fa fa-check-square fa-fw'}
          />
          {bestID(dev)}
        </div>
      );
    });

    const types = typeModels.map((typ) => {
      const i = filters.types.indexOf(typ.slug);
      return (
        <div
          className="filter-option"
          onClick={i < 0 ?
            () => this.props.actions.addFilterType(typ.slug) :
            () => this.props.actions.removeFilterType(typ.slug)
          }
        >
          <i
            className={i < 0 ? 'fa fa-square-o fa-fw' : 'fa fa-check-square fa-fw'}
          />
          {typ.name}
        </div>
      );
    });

    return (
      <div
        className={this.props.open ? 'open filter-panel' : 'filter-panel'}
      >
        <div
          className={
            (filters.developers.length === 0 &&
            filters.types.length === 0 &&
            !filters.startDate && !filters.endDate)
            || this.props.open ?
            'filter-flag inactive' : 'filter-flag'
        }
        >
          <i className="fa fa-exclamation-triangle" /> Filtered
        </div>
        <i
          className="fa fa-times"
          onClick={this.props.closePanel}
        />
        <div>
          <button
            className="reset"
            onClick={() => this.props.actions.resetFilters()}
            disabled={
              (filters.developers.length === 0 &&
              filters.types.length === 0 &&
              !filters.startDate && !filters.endDate)
            }
          ><i className="fa fa-refresh" /> Reset</button>
        </div>
        <h4>Developers</h4>
        <div className="filter-options">
          {developers}
        </div>
        <h4>Types</h4>
        <div className="filter-options">
          {types}
        </div>
        <h4>Run date</h4>
        <div>
          <DateRangePicker
            startDate={this.props.filters.startDate}
            endDate={this.props.filters.endDate}
            onDatesChange={({ startDate, endDate }) =>
              this.props.actions.setFilterDateRange(startDate, endDate)}
            focusedInput={this.state.focusedInput}
            onFocusChange={focusedInput => this.setState({ focusedInput })}
            daySize={22}
            showClearDates
          />
        </div>
      </div>
    );
  }
}


Filter.propTypes = {
  open: PropTypes.bool.isRequired,
  closePanel: PropTypes.func.isRequired,
  session: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};


export default Filter;
