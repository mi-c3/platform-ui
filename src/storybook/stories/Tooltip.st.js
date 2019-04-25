import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';

import H3 from 'storybook/components/atoms/H3';
import { Typography, Grid, Button, Tooltip } from 'index';

storiesOf('Components|Tooltip', module)
    .addDecorator(withKnobs)
    .add('Tooltip', () => {
        const title = text('Title', 'Add any text in `KNOBS` tab');
        return (
            <Fragment>
                <H3>Try to hover on eny element</H3>
                <Grid container justify="center">
                    <Grid item>
                        <Tooltip
                            title="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                            placement="top-start"
                        >
                            <Button variant="text">top-start</Button>
                        </Tooltip>
                        <Tooltip
                            title={
                                <Fragment>
                                    <Typography variant="h5" color="inherit">
                                        HTML Text `h5`
                                    </Typography>
                                    <Typography variant="caption" color="inherit">
                                        This is `caption` text and more recently with desktop publishing software like Aldus PageMake
                                    </Typography>
                                </Fragment>
                            }
                            placement="top"
                        >
                            <Button variant="text">top</Button>
                        </Tooltip>
                        <Tooltip title={title} placement="top-end">
                            <Button variant="text">top-end</Button>
                        </Tooltip>
                    </Grid>
                </Grid>
                <Grid container justify="center">
                    <Grid item xs={6}>
                        <Tooltip title={title} placement="left-start">
                            <Button variant="text">left-start</Button>
                        </Tooltip>
                        <br />
                        <Tooltip title={title} placement="left">
                            <Button variant="text">left</Button>
                        </Tooltip>
                        <br />
                        <Tooltip title={title} placement="left-end">
                            <Button variant="text">left-end</Button>
                        </Tooltip>
                    </Grid>
                    <Grid item container xs={6} alignItems="flex-end" direction="column" spacing={0}>
                        <Grid item>
                            <Tooltip title={title} placement="right-start">
                                <Button variant="text">right-start</Button>
                            </Tooltip>
                        </Grid>
                        <Grid item>
                            <Tooltip title={title} placement="right">
                                <Button variant="text">right</Button>
                            </Tooltip>
                        </Grid>
                        <Grid item>
                            <Tooltip title={title} placement="right-end">
                                <Button variant="text">right-end</Button>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container justify="center">
                    <Grid item>
                        <Tooltip title={title} placement="bottom-start">
                            <Button variant="text">bottom-start</Button>
                        </Tooltip>
                        <Tooltip title={title} placement="bottom">
                            <Button variant="text">bottom</Button>
                        </Tooltip>
                        <Tooltip title={title} placement="bottom-end">
                            <Button variant="text">bottom-end</Button>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Fragment>
        );
    });
