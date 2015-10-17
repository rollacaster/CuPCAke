import React from 'react';
import qs from 'qs';
import {History} from 'react-router';
import {RadioButtons, DatePicker} from '../UI/Forms/FormElements';
import {Button, Title} from '../UI';
import {visBuilder} from '../Helpers/Constants/Help';

const now = (new Date()).getTime();
const buttons = ['Historic Analysis', 'Real-time Analysis'];

/**
 * Allows to specify a timeframe for a visualizations. A Visualization
 * can show realtime or historic context data.
 * @class
 * @augments external:Component
 * @alias TimeBuilder
 * @memberOf module:VisualizationConfigurator
*/
export default React.createClass({
  mixins: [History],

  getInitialState: function() {
    return {
      date: true
    }
  },

  handleTimeChoosed: function(formData) {
    const query = qs.parse(this.props.params.query);

    if (formData.start && formData.end) {
      const {start,end} = formData
      query.start = start;
      query.end = end;
    } else {
      query.realtime = true;
    }

    const visualizationRoute = `visBuilder/vis/${qs.stringify(query)}`;
    this.history.pushState(null, visualizationRoute);
  },

  handleTimeSelect: function(formData) {
    if (formData.time === buttons[0]) {
      this.setState({date: true});
    } else {
      this.setState({date: false});
    }
  },

         render: function() {
           const {date} = this.state;

           return (
             <div className="content">
                 <Title name="Visualization Time" help={visBuilder.time} medium/>
                 <Formsy.Form onValidSubmit={this.handleTimeChoosed} className="form"
                              onChange={this.handleTimeSelect}>
                     <div className="items well">
                         <h4 className="items__title">Analysis type</h4>
                         <RadioButtons name="time" buttons={buttons} value={buttons[0]} primary/>
                     </div>
                     { date ?
                      <div className="items well">
                      <h4 className="items__title">Timespan</h4>
                      <div className="form__dates">
                      <DatePicker name="start" text="Start of Visualization"
                      value={now} />
                      <DatePicker name="end" text="End of Visualization"
                      value={now} />
                      </div>

                      </div> :
                            ''}
                      <Button text="Choose Visualization" type="submit" primary />
                 </Formsy.Form>
             </div>
           );
         }
});
