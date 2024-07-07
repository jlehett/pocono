import React, { useEffect, useState } from 'react';
import { act, render } from '@testing-library/react';

type OnUpdateCallback = (prev: any) => any;

type RenderTrackerProps = {
    id?: any;
    children?: React.ReactNode;
};
type RenderTracker = ({ id, children }: RenderTrackerProps) => React.ReactNode;

type TestComponentProps = {
    containerValue: any;
};
type TestComponent = ({
    containerValue,
}: TestComponentProps) => React.ReactNode;

type Container = () => React.ReactNode;

function RenderTracker_factory(
    renderTracker: jest.Mock,
    mountTracker: jest.Mock,
    unmountTracker: jest.Mock,
): RenderTracker {
    return function RenderTracker({ id, children }: RenderTrackerProps) {
        useEffect(() => {
            mountTracker(id);
            return () => unmountTracker(id);
        }, []);

        renderTracker(id);

        return children;
    };
}

function Container_factory(
    TestComponent: React.ElementType,
    initialValue: any = false,
    onUpdate: OnUpdateCallback = (prev) => !prev,
): Container {
    return function Container() {
        const [containerValue, setContainerValue] = useState(initialValue);

        return (
            <div>
                <TestComponent containerValue={containerValue} />
                <button
                    data-testid="update-container"
                    onClick={() => setContainerValue(onUpdate)}
                >
                    Update
                </button>
            </div>
        );
    };
}

type RenderCycleTest = {
    renderTracker: jest.Mock;
    mountTracker: jest.Mock;
    unmountTracker: jest.Mock;
    updateContainer: () => void;
};

export function createRenderCycleTest(
    TestComponent_factory: (RenderTracker: RenderTracker) => TestComponent,
    containerInitialValue: any = false,
    onUpdateContainer: OnUpdateCallback = (prev) => !prev,
): RenderCycleTest {
    const renderTracker = jest.fn();
    const mountTracker = jest.fn();
    const unmountTracker = jest.fn();

    const RenderTracker = RenderTracker_factory(
        renderTracker,
        mountTracker,
        unmountTracker,
    );
    const TestComponent = TestComponent_factory(RenderTracker);
    const Container = Container_factory(
        TestComponent,
        containerInitialValue,
        onUpdateContainer,
    );

    const rtl = render(<Container />);

    function updateContainer() {
        act(() => {
            rtl.getByTestId('update-container').click();
        });
    }

    return {
        renderTracker,
        mountTracker,
        unmountTracker,
        updateContainer,
    };
}
