#  Copyright (c) 2022, CRS4
#
#  Permission is hereby granted, free of charge, to any person obtaining a copy of
#  this software and associated documentation files (the "Software"), to deal in
#  the Software without restriction, including without limitation the rights to
#  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
#  the Software, and to permit persons to whom the Software is furnished to do so,
#  subject to the following conditions:
#
#  The above copyright notice and this permission notice shall be included in all
#  copies or substantial portions of the Software.
#
#  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
#  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
#  FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
#  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
#  IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
#  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

from lab_manager.permissions import IsLabManager

from reviews_manager.models import ClinicalAnnotationStep
from rois_manager.models import Slice, Core, FocusRegion
from lab_manager.models import LabNote
from lab_manager.serializers import LabNoteSerializer

import logging

logger = logging.getLogger("promort")


class LabNoteList(APIView):
    model = LabNote
    model_serializer = LabNoteSerializer
    permission_classes = (IsLabManager,)

    def _get_rois_annotation_step(self, cann_step_label):
        try:
            c_ann = ClinicalAnnotationStep.objects.get(label=cann_step_label)
            return c_ann.rois_review_step, c_ann
        except ClinicalAnnotationStep.DoesNotExist:
            raise NotFound("Clinical Annotation step not found")

    def _get_slice(self, rois_annotation_step, roi_id):
        try:
            return Slice.objects.get(id=roi_id, annotation_step=rois_annotation_step)
        except Slice.DoesNotExist:
            raise NotFound("Slice not found")

    def _get_core(self, rois_annotation_step, roi_id):
        try:
            return Core.objects.get(
                id=roi_id, slice__annotation_step=rois_annotation_step
            )
        except Core.DoesNotExist:
            raise NotFound("Core not found")

    def _get_focus_region(self, rois_annotation_step, roi_id):
        try:
            return FocusRegion.objects.get(
                id=roi_id, core__slice__annotation_step=rois_annotation_step
            )
        except FocusRegion.DoesNotExist:
            raise NotFound("Focus region not found")

    def _get_roi(self, step_label, roi_type, roi_id):
        r_ann_step, c_ann_step = self._get_rois_annotation_step(step_label)
        if roi_type == "slice":
            return self._get_slice(r_ann_step, roi_id), c_ann_step
        elif roi_type == "core":
            return self._get_core(r_ann_step, roi_id), c_ann_step
        elif roi_type == "focus_region":
            return self._get_focus_region(r_ann_step, roi_id), c_ann_step

    def get(self, request, step_label, roi_type, roi_id, format=None):
        roi_obj, _ = self._get_roi(step_label, roi_type, roi_id)
        serializer = LabNoteSerializer(roi_obj.notes.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, step_label, roi_type, roi_id, format=None):
        note = request.data["note"]
        roi_obj, c_ann_step = self._get_roi(step_label, roi_type, roi_id)
        note_obj = LabNote.objects.create(
            content_object=roi_obj,
            note=note,
            author=request.user,
            annotation_step=c_ann_step,
        )
        return Response(
            LabNoteSerializer(note_obj).data, status=status.HTTP_201_CREATED
        )
