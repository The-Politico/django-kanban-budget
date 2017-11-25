import React from 'react';
import PropTypes from 'prop-types';
import { Multiselect, DropdownList } from 'react-widgets';

const Status = (props) => {
  const project = props.project;
  const db = props.session;

  const types = db.Type.all().toRefArray();
  const tags = db.Tag.all().toRefArray();
  const columns = db.Column.orderBy('position').toModelArray()
    .map(c => ({
      name: c.name,
      slug: c.slug,
      board: c.board.name,
    }));

  return (
    <div className="clearfix">
      <div className="half">
        <div className="input-group">
          <label htmlFor="type">Type</label>
          <DropdownList
            data={types}
            textField="name"
            valueField="slug"
            value={project.type}
            onChange={value => this.props.patchProject({
              slug: project.slug,
              type: value.slug,
            })}
            itemComponent={({ item }) => (
              <div>
                <i
                  className="fa fa-square"
                  style={{ color: item.color }}
                /> {item.name}
              </div>
            )}
            valueComponent={({ item }) => {
              if (!item) return null;
              return (
                <div>
                  <i
                    className="fa fa-square"
                    style={{ color: item.color }}
                  /> {item.name}
                </div>
              );
            }}
          />
        </div>
        <div className="input-group">
          <label htmlFor="status">Status</label>
          <DropdownList
            data={columns}
            textField="name"
            valueField="slug"
            value={project.status}
            onChange={value => {
              this.props.patchProject({
                slug: project.slug,
                status: value.slug,
              });
              this.props.closeModal();
            }}
            groupBy="board"
          />
        </div>
      </div>
      <div className="half">
        <div className="input-group">
          <label htmlFor="tags">Tags</label>
          <Multiselect
            name="tags"
            value={project.tags.toRefArray()}
            data={tags}
            textField="name"
            valueField="slug"
            onChange={value => this.props.patchProject({
              slug: project.slug,
              tags: value.map(d => d.slug),
            })}
          />
        </div>
      </div>
    </div>
  );
};

Status.propTypes = {
  project: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  patchProject: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default Status;
