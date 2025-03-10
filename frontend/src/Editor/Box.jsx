import React, { useEffect, useState, useMemo, useContext, useRef, memo, useCallback } from 'react';
import { Button } from './Components/Button';
import { Image } from './Components/Image';
import { Text } from './Components/Text';
import { Table } from './Components/Table/Table';
import { TextInput } from './Components/TextInput';
import { NumberInput } from './Components/NumberInput';
import { TextArea } from './Components/TextArea';
import { Container } from './Components/Container';
import { Tabs } from './Components/Tabs';
import { RichTextEditor } from './Components/RichTextEditor';
import { DropDown } from './Components/DropDown';
import { Checkbox } from './Components/Checkbox';
import { Datepicker } from './Components/Datepicker';
import { DaterangePicker } from './Components/DaterangePicker';
import { Multiselect } from './Components/Multiselect';
import { Modal } from './Components/Modal';
import { Chart } from './Components/Chart';
import { Map } from './Components/Map/Map';
import { QrScanner } from './Components/QrScanner/QrScanner';
import { ToggleSwitch } from './Components/Toggle';
import { RadioButton } from './Components/RadioButton';
import { StarRating } from './Components/StarRating';
import { Divider } from './Components/Divider';
import { FilePicker } from './Components/FilePicker';
import { PasswordInput } from './Components/PasswordInput';
import { Calendar } from './Components/Calendar';
import { Listview } from './Components/Listview';
import { IFrame } from './Components/IFrame';
import { CodeEditor } from './Components/CodeEditor';
import { Timer } from './Components/Timer';
import { Statistics } from './Components/Statistics';
import { Pagination } from './Components/Pagination';
import { Tags } from './Components/Tags';
import { Spinner } from './Components/Spinner';
import { CircularProgressBar } from './Components/CirularProgressbar';
import { renderTooltip, getComponentName } from '@/_helpers/appUtils';
import { RangeSlider } from './Components/RangeSlider';
import { Timeline } from './Components/Timeline';
import { SvgImage } from './Components/SvgImage';
import { Html } from './Components/Html';
import { ButtonGroup } from './Components/ButtonGroup';
import { CustomComponent } from './Components/CustomComponent/CustomComponent';
import { VerticalDivider } from './Components/verticalDivider';
import { PDF } from './Components/PDF';
import { ColorPicker } from './Components/ColorPicker';
import { KanbanBoard } from './Components/KanbanBoard/KanbanBoard';
import { Kanban } from './Components/Kanban/Kanban';
import { Steps } from './Components/Steps';
import { TreeSelect } from './Components/TreeSelect';
import { Icon } from './Components/Icon';
import { Link } from './Components/Link';
import { Form } from './Components/Form/Form';
import { BoundedBox } from './Components/BoundedBox/BoundedBox';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import '@/_styles/custom.scss';
import { validateProperties } from './component-properties-validation';
import { validateWidget } from '@/_helpers/utils';
import { componentTypes } from './WidgetManager/components';
import {
  resolveProperties,
  resolveStyles,
  resolveGeneralProperties,
  resolveGeneralStyles,
} from './component-properties-resolution';
import _ from 'lodash';
import { EditorContext } from '@/Editor/Context/EditorContextWrapper';
import { useTranslation } from 'react-i18next';
import { useCurrentState } from '@/_stores/currentStateStore';
import { useAppInfo } from '@/_stores/appDataStore';

export const AllComponents = {
  Button,
  Image,
  Text,
  TextInput,
  NumberInput,
  Table,
  TextArea,
  Container,
  Tabs,
  RichTextEditor,
  DropDown,
  Checkbox,
  Datepicker,
  DaterangePicker,
  Multiselect,
  Modal,
  Chart,
  Map,
  QrScanner,
  ToggleSwitch,
  RadioButton,
  StarRating,
  Divider,
  FilePicker,
  PasswordInput,
  Calendar,
  IFrame,
  CodeEditor,
  Listview,
  Timer,
  Statistics,
  Pagination,
  Tags,
  Spinner,
  CircularProgressBar,
  RangeSlider,
  Timeline,
  SvgImage,
  Html,
  ButtonGroup,
  CustomComponent,
  VerticalDivider,
  PDF,
  ColorPicker,
  KanbanBoard,
  Kanban,
  Steps,
  TreeSelect,
  Link,
  Icon,
  Form,
  BoundedBox,
};

export const Box = memo(
  ({
    id,
    width,
    height,
    yellow,
    preview,
    component,
    inCanvas,
    onComponentClick,
    onEvent,
    onComponentOptionChanged,
    onComponentOptionsChanged,
    paramUpdated,
    changeCanDrag,
    containerProps,
    removeComponent,
    canvasWidth,
    mode,
    customResolvables,
    parentId,
    sideBarDebugger,
    readOnly,
    childComponents,
    isResizing,
    adjustHeightBasedOnAlignment,
    currentLayout,
  }) => {
    const { t } = useTranslation();
    const backgroundColor = yellow ? 'yellow' : '';
    const currentState = useCurrentState();
    const { events } = useAppInfo();

    const componentMeta = useMemo(() => {
      return componentTypes.find((comp) => component.component === comp.component);
    }, [component]);

    const ComponentToRender = AllComponents[component.component];
    const [renderCount, setRenderCount] = useState(0);
    const [renderStartTime, setRenderStartTime] = useState(new Date());
    const [resetComponent, setResetStatus] = useState(false);

    const resolvedProperties = resolveProperties(component, currentState, null, customResolvables);
    const [validatedProperties, propertyErrors] =
      mode === 'edit' && component.validate
        ? validateProperties(resolvedProperties, componentMeta.properties)
        : [resolvedProperties, []];

    const resolvedStyles = resolveStyles(component, currentState, null, customResolvables);

    const [validatedStyles, styleErrors] =
      mode === 'edit' && component.validate
        ? validateProperties(resolvedStyles, componentMeta.styles)
        : [resolvedStyles, []];

    const resolvedGeneralProperties = resolveGeneralProperties(component, currentState, null, customResolvables);
    const [validatedGeneralProperties, generalPropertiesErrors] =
      mode === 'edit' && component.validate
        ? validateProperties(resolvedGeneralProperties, componentMeta.general)
        : [resolvedGeneralProperties, []];

    const resolvedGeneralStyles = resolveGeneralStyles(component, currentState, null, customResolvables);
    resolvedStyles.visibility = resolvedStyles.visibility !== false ? true : false;
    const [validatedGeneralStyles, generalStylesErrors] =
      mode === 'edit' && component.validate
        ? validateProperties(resolvedGeneralStyles, componentMeta.generalStyles)
        : [resolvedGeneralStyles, []];

    const darkMode = localStorage.getItem('darkMode') === 'true';
    const { variablesExposedForPreview, exposeToCodeHinter } = useContext(EditorContext) || {};

    let styles = {
      height: '100%',
    };

    if (inCanvas) {
      styles = {
        ...styles,
      };
    }
    useEffect(() => {
      if (!component?.parent) {
        onComponentOptionChanged && onComponentOptionChanged(component, 'id', id);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); /*computeComponentState was not getting the id on initial render therefore exposed variables were not set.
  computeComponentState was being executed before addNewWidgetToTheEditor was completed.*/

    useEffect(() => {
      const currentPage = currentState?.page;
      const componentName = getComponentName(currentState, id);
      const errorLog = Object.fromEntries(
        [...propertyErrors, ...styleErrors, ...generalPropertiesErrors, ...generalStylesErrors].map((error) => [
          `${componentName} - ${error.property}`,
          {
            page: currentPage,
            type: 'component',
            kind: 'component',
            strace: 'page_level',
            data: { message: `${error.message}`, status: true },
            resolvedProperties: resolvedProperties,
            effectiveProperties: validatedProperties,
          },
        ])
      );
      sideBarDebugger?.error(errorLog);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify({ propertyErrors, styleErrors, generalPropertiesErrors })]);

    useEffect(() => {
      setRenderCount(renderCount + 1);
      if (renderCount > 10) {
        setRenderCount(0);
        const currentTime = new Date();
        const timeDifference = Math.abs(currentTime - renderStartTime);
        if (timeDifference < 1000) {
          throw Error;
        }
        setRenderStartTime(currentTime);
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify({ resolvedProperties, resolvedStyles })]);

    useEffect(() => {
      if (customResolvables && !readOnly && mode === 'edit') {
        const newCustomResolvable = {};
        newCustomResolvable[id] = { ...customResolvables };
        exposeToCodeHinter((prevState) => ({ ...prevState, ...newCustomResolvable }));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(customResolvables), readOnly]);

    useEffect(() => {
      if (resetComponent) setResetStatus(false);
    }, [resetComponent]);

    let exposedVariables = currentState?.components[component.name] ?? {};

    const fireEvent = (eventName, options) => {
      if (mode === 'edit' && eventName === 'onClick') {
        onComponentClick(id, component);
      }

      const componentEvents = events.filter((event) => event.sourceId === id);

      onEvent(eventName, componentEvents, { ...options, customVariables: { ...customResolvables } });
    };
    const validate = (value) =>
      validateWidget({
        ...{ widgetValue: value },
        ...{ validationObject: component.definition.validation, currentState },
        customResolveObjects: customResolvables,
      });
    const shouldAddBoxShadow = ['TextInput', 'PasswordInput', 'NumberInput', 'Text'];
    return (
      <OverlayTrigger
        placement={inCanvas ? 'auto' : 'top'}
        delay={{ show: 500, hide: 0 }}
        trigger={
          inCanvas && shouldAddBoxShadow.includes(component.component)
            ? !validatedProperties.tooltip?.toString().trim()
              ? null
              : ['hover', 'focus']
            : !validatedGeneralProperties.tooltip?.toString().trim()
            ? null
            : ['hover', 'focus']
        }
        overlay={(props) =>
          renderTooltip({
            props,
            text: inCanvas
              ? `${
                  shouldAddBoxShadow.includes(component.component)
                    ? validatedProperties.tooltip
                    : validatedGeneralProperties.tooltip
                }`
              : `${t(`widget.${component.name}.description`, component.description)}`,
          })
        }
      >
        <div
          style={{
            ...styles,
            backgroundColor,
            padding: validatedStyles?.padding ? (validatedStyles?.padding == 'default' ? '1px' : '0px') : '1px',
          }}
          role={preview ? 'BoxPreview' : 'Box'}
        >
          {!resetComponent ? (
            <ComponentToRender
              onComponentClick={onComponentClick}
              onComponentOptionChanged={onComponentOptionChanged}
              currentState={currentState}
              onEvent={onEvent}
              id={id}
              paramUpdated={paramUpdated}
              width={width}
              changeCanDrag={changeCanDrag}
              onComponentOptionsChanged={onComponentOptionsChanged}
              height={height}
              component={component}
              containerProps={containerProps}
              darkMode={darkMode}
              removeComponent={removeComponent}
              canvasWidth={canvasWidth}
              properties={validatedProperties}
              exposedVariables={exposedVariables}
              styles={{
                ...validatedStyles,
                ...(!shouldAddBoxShadow.includes(component.component)
                  ? { boxShadow: validatedGeneralStyles?.boxShadow }
                  : {}),
              }}
              setExposedVariable={(variable, value) => onComponentOptionChanged(component, variable, value, id)}
              setExposedVariables={(variableSet) =>
                onComponentOptionsChanged(component, Object.entries(variableSet), id)
              }
              fireEvent={fireEvent}
              validate={validate}
              parentId={parentId}
              customResolvables={customResolvables}
              variablesExposedForPreview={variablesExposedForPreview}
              exposeToCodeHinter={exposeToCodeHinter}
              setProperty={(property, value) => {
                paramUpdated(id, property, { value });
              }}
              mode={mode}
              resetComponent={() => setResetStatus(true)}
              childComponents={childComponents}
              dataCy={`draggable-widget-${String(component.name).toLowerCase()}`}
              isResizing={isResizing}
              adjustHeightBasedOnAlignment={adjustHeightBasedOnAlignment}
              currentLayout={currentLayout}
            ></ComponentToRender>
          ) : (
            <></>
          )}
        </div>
      </OverlayTrigger>
    );
  }
);
